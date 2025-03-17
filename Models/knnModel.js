import { kNear } from 'knear'; // Destructure the correct function

const knn = new kNear(3); // Use the actual function

knn.learn([5, 1], "Hello");
knn.learn([2, 0], "Peace");
knn.learn([1, 1], "Thumbs Up");
knn.learn([3, 0], "OK");

export const classifyData = (input) => knn.classify(input);
