import { kNear } from 'knear'; // Destructure the correct function

const knn = new kNear(3); // Use the actual function

knn.learn([1, 2], 'A');
knn.learn([3, 4], 'B');
knn.learn([5, 6], 'B');
knn.learn([7, 8], 'B');
knn.learn([0, 1], 'A');
knn.learn([2, 3], 'A');

export const classifyData = (input) => knn.classify(input);
