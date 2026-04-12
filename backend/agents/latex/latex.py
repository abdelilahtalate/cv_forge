from agents.latex.compiler import latex_compiler
from agents.latex.generator import latex_generator

# This file acts as a facade for the latex agent components
# split into compiler and generator as requested.

class LatexAgent:
    """
    Main entry point for LaTeX related tasks.
    Coordinates between template generation and PDF compilation.
    """
    def __init__(self):
        self.generator = latex_generator
        self.compiler = latex_compiler

    def generate_and_compile(self, data: dict, template_name: str = "modern_cv.tex", output_name: str = "CV_Generated") -> str:
        """
        Generates LaTeX code from data and compiles it to PDF.
        Returns the path to the PDF.
        """
        tex_content = self.generator.generate(data, template_name)
        pdf_path = self.compiler.compile(tex_content, output_name)
        return pdf_path

# Singleton
latex_agent = LatexAgent()
