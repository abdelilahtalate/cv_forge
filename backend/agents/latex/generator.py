import os
import re
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

class LatexGenerator:
    def __init__(self, templates_dir: str = None):
        if templates_dir is None:
            # Default to templates folder next to this file
            self.templates_dir = Path(__file__).parent / "templates"
        else:
            self.templates_dir = Path(templates_dir)
        # Configure Jinja2 to work with LaTeX (change delimiters to avoid conflict with LaTeX curly braces)
        self.env = Environment(
            block_start_string='\BLOCK{',
            block_end_string='}',
            variable_start_string='\VAR{',
            variable_end_string='}',
            comment_start_string='\#{',
            comment_end_string='}',
            line_statement_prefix='%%',
            line_comment_prefix='%#',
            trim_blocks=True,
            autoescape=None, # LaTeX doesn't need HTML escaping
            loader=FileSystemLoader(str(self.templates_dir))
        )
        
        # Add a custom filter to escape LaTeX special characters
        self.env.filters['latex_escape'] = self.escape_latex

    def escape_latex(self, text: str) -> str:
        """
        Escapes LaTeX special characters in a string.
        """
        if not text:
            return ""
        
        conv = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\^{}',
            '\\': r'\textbackslash{}',
            '<': r'\textless{}',
            '>': r'\textgreater{}',
        }
        regex = r'|'.join(re.escape(str(key)) for key in sorted(conv.keys(), key=lambda item: -len(item)))
        return re.sub(regex, lambda match: conv[match.group()], text)

    def generate(self, data: dict, template_name: str = "modern_cv.tex") -> str:
        """
        Populates a LaTeX template with data.
        """
        try:
            template = self.env.get_template(template_name)
            return template.render(**data)
        except Exception as e:
            raise Exception(f"Generator Error: {str(e)}")

# Singleton instance
latex_generator = LatexGenerator()
