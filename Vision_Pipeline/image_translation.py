import cv2
import numpy as np
import os
import matplotlib.pyplot as plt

class TextOrientationDetector:
    def __init__(self, image_path, y_threshold=20, x_threshold=0, line_threshold=5, min_line_length=15):
        self.image_path = image_path
        self.y_threshold = y_threshold
        self.x_threshold = x_threshold
        self.line_threshold = line_threshold
        self.min_line_length = min_line_length
        self.image = self._load_image()
        self.bounding_boxes = []

    def _load_image(self):
        """Load image from path and handle exceptions if file is not found."""
        image = cv2.imread(self.image_path)
        if image is None:
            raise FileNotFoundError(f"Image not found: {self.image_path}")
        return image

    def _preprocess_image(self):
        """Convert image to grayscale and apply binary thresholding."""
        gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        return binary

    def detect_text_orientation(self):
        """Detect text contours and return bounding boxes."""
        binary = self._preprocess_image()
        edges = cv2.Canny(binary, 50, 150, apertureSize=7)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        self.bounding_boxes = [cv2.boundingRect(contour) for contour in contours]
        return self.bounding_boxes

    def merge_line_bounding_boxes(self):
        """Merge bounding boxes that are close vertically (same line) and horizontally (within threshold)."""
        if not self.bounding_boxes:
            return []

        # Sort bounding boxes by y-coordinate to group them by lines
        self.bounding_boxes = sorted(self.bounding_boxes, key=lambda box: box[1])
        merged_boxes = []
        current_line_boxes = []
        current_line_y = self.bounding_boxes[0][1]

        for box in self.bounding_boxes:
            x, y, w, h = box
            if abs(y - current_line_y) <= self.line_threshold:
                current_line_boxes.append(box)
            else:
                merged_boxes.extend(self._merge_horizontal_boxes(current_line_boxes))
                current_line_boxes = [box]
                current_line_y = y

        if current_line_boxes:
            merged_boxes.extend(self._merge_horizontal_boxes(current_line_boxes))

        self.bounding_boxes = merged_boxes
        return self.bounding_boxes

    def _merge_horizontal_boxes(self, boxes):
        """Merge boxes that are close horizontally."""
        if not boxes:
            return []

        boxes = sorted(boxes, key=lambda box: box[0])
        merged = []
        current_box = boxes[0]

        for next_box in boxes[1:]:
            (x1, y1, w1, h1) = current_box
            (x2, y2, w2, h2) = next_box

            if x2 <= x1 + w1 + self.x_threshold:
                new_x = min(x1, x2)
                new_y = min(y1, y2)
                new_w = max(x1 + w1, x2 + w2) - new_x
                new_h = max(y1 + h1, y2 + h2) - new_y
                current_box = (new_x, new_y, new_w, new_h)
            else:
                merged.append(current_box)
                current_box = next_box

        merged.append(current_box)
        return merged

    def detect_lines(self):
        """Detect lines by grouping bounding boxes that are close vertically and have enough boxes to form a line."""
        if not self.bounding_boxes:
            return []

        lines = []
        current_line = []
        current_line_y = self.bounding_boxes[0][1]

        for box in self.bounding_boxes:
            x, y, w, h = box
            if abs(y - current_line_y) <= self.y_threshold:
                current_line.append(box)
            else:
                if len(current_line) >= self.min_line_length:
                    lines.append(current_line)
                current_line = [box]
                current_line_y = y

        if len(current_line) >= self.min_line_length:
            lines.append(current_line)

        return lines

    def draw_bounding_boxes(self, image, boxes):
        """Draw bounding boxes on the image."""
        for box in boxes:
            x, y, w, h = box
            if w * h > 100 and w * h < 2000 and h < 20:
                cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
        return plt.imshow(image)

def process_images_in_folder(folder_path):
    """Process all images in a given folder to detect text orientation."""
    all_defects = {}
    for image_file in os.listdir(folder_path):
        image_path = os.path.join(folder_path, image_file)
        detector = TextOrientationDetector(image_path)
        bounding_boxes = detector.detect_text_orientation()
        merged_boxes = detector.merge_line_bounding_boxes()
        lines = detector.detect_lines()

        image = detector.image.copy()
        slopes = []

        for line in lines:
            detector.draw_bounding_boxes(image, line)
            slopes.append(
                (max([j[1] for j in line]) - min([j[1] for j in line])) /
                (max([j[0] for j in line]) - min([j[0] for j in line]))
            )

        print(f"Average slope for {image_file}: {np.median(slopes).round(4)}")

        if np.median(slopes).round(4) >= 0.05:
            defect = 'Scan Defect'
        else:
            defect = 'not defected'
        
        all_defects[image_file] = defect
    
    return all_defects
        # plt.show()


# process_images_in_folder(r'D:\PycharmProjects\Supreme_Court_Project\supreme_detect\images\train')