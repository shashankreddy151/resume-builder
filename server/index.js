const express = require('express');
const cors = require('cors');
const { generateLatex } = require('./utils/latexGenerator');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', (req, res) => {
  const resumeData = req.body;

  // 1. Generate LaTeX content
  const texContent = generateLatex(resumeData);

  // 2. Write LaTeX content to a .tex file in the server folder
  const texFilePath = path.join(__dirname, 'resume.tex');
  fs.writeFileSync(texFilePath, texContent);

  // 3. Full path to pdflatex.exe (adjust if yours is located elsewhere)
  const pdflatexPath = `"C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe"`;

  // 4. Build the command string, quoting both output-directory and the .tex file path
  //    -output-directory needs to be quoted in case __dirname has spaces.
  const cmd = `${pdflatexPath} -output-directory="${__dirname}" "${texFilePath}"`;

  // 5. Execute pdflatex
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Error generating PDF:', err);
      return res.status(500).send('Failed to generate PDF');
    }

    // 6. If pdflatex succeeded, send the generated PDF back to the client
    const pdfPath = path.join(__dirname, 'resume.pdf');
    res.download(pdfPath, 'resume.pdf', (downloadErr) => {
      if (downloadErr) {
        console.error('Error sending file:', downloadErr);
      }

      // 7. Clean up: remove .tex and .pdf files after sending
      try {
        fs.unlinkSync(texFilePath);
        fs.unlinkSync(pdfPath);
      } catch (unlinkErr) {
        console.error('Error cleaning up files:', unlinkErr);
      }
    });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
