import os
import re

def replace_colors(content):
    # Replace teal with primary
    content = re.sub(r'teal-(\d+)', r'primary-\1', content)
    # Replace teal-50 with primary-50
    content = re.sub(r'teal-50\b', r'primary-50', content)
    
    # Specific branding replacements
    content = content.replace('LexAgenda', 'EstéticaApp')
    content = content.replace('agendamiento legal', 'agendamiento estético')
    content = content.replace('consulta legal', 'cita estética')
    content = content.replace('ScaleIcon', 'SparklesIcon')
    
    # Text replacements for clinical domain
    content = content.replace('abogados', 'especialistas')
    content = content.replace('Abogados', 'Especialistas')
    content = content.replace('abogado', 'especialista')
    content = content.replace('Abogado', 'Especialista')
    content = content.replace('cliente', 'paciente')
    content = content.replace('Cliente', 'Paciente')
    
    return content

target_dirs = [
    'src/components/public',
    'src/app/(public)',
    'src/app/(main)',
    'src/features'
]

for target_dir in target_dirs:
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = replace_colors(content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f'Updated: {path}')
