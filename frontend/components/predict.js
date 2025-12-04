// src/lib/rf_predict.js
import model from "@/components/rf_model.json";

const { n_features, classes, trees } = model;

// Named export (IMPORTANT)
export function predictRF(features) {
  if (!Array.isArray(features) || features.length !== n_features) {
    return null;
  }

  const votes = new Array(classes.length).fill(0);

  for (const tree of trees) {
    let node = 0;

    while (true) {
      const featureIndex = tree.feature[node];

      // LEAF NODE
      if (featureIndex === -2) {
        const values = tree.value[node]; // [num_classes]
        let bestIdx = 0;

        for (let i = 1; i < values.length; i++) {
          if (values[i] > values[bestIdx]) bestIdx = i;
        }

        votes[bestIdx] += 1;
        break;
      }

      const threshold = tree.threshold[node];
      const fVal = features[featureIndex];

      if (fVal <= threshold) {
        node = tree.children_left[node];
      } else {
        node = tree.children_right[node];
      }
    }
  }

  // Majority vote across trees
  let bestIdx = 0;
  for (let i = 1; i < votes.length; i++) {
    if (votes[i] > votes[bestIdx]) bestIdx = i;
  }

  return classes[bestIdx];
}
