let recognizer;

function predictWord() {
  // Array of words that the recognizer is trained to recognize.
  const words = recognizer.wordLabels();
  recognizer.listen(
    ({ scores }) => {
      // Turn scores into a list of (score,word) pairs.
      scores = Array.from(scores).map((s, i) => ({ score: s, word: words[i] }));
      // Find the most probable word.
      scores.sort((s1, s2) => s2.score - s1.score);

      var div = document.getElementById("chart");
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }

      var chart = anychart.bar();
      chart.title("Model Prediction");

      var rows = scores.map((score) => {
        return [score.word, score.score];
      });

      var data = {
        header: ["Model", "Score"],
        rows: rows,
      };

      chart.data(data);
      chart.container("chart");
      chart.draw();

      document.querySelector("#console").textContent = scores[0].word;
    },
    { probabilityThreshold: 0.75 }
  );
}

async function app() {
  recognizer = speechCommands.create(
    "BROWSER_FFT",
    null,
    "https://wakeword.shivammalhotra.dev/model.json",
    "https://wakeword.shivammalhotra.dev/metadata.json"
  );
  await recognizer.ensureModelLoaded();
  predictWord();
}

app();
