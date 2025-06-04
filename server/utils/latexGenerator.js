function generateLatex(data) {
  return `
\\documentclass{article}
\\usepackage{hyperref}
\\begin{document}
\\begin{center}
\\Huge{${data.name}} \\\\
\\normalsize{${data.email} | ${data.phone}}
\\end{center}
\\section*{Experience}
${data.experience}
\\end{document}
  `;
}

module.exports = { generateLatex };
