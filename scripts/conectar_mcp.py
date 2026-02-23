import json
import os

def update_mcp_config():
    mcp_path = r'c:\Users\USUARIO\Documents\DEV\CLINICAS ESTETICA\.mcp.json'
    project_ref = 'bpuuybnngibzgkwwwlme'
    
    if not os.path.exists(mcp_path):
        print(f"Error: {mcp_path} no encontrado.")
        return

    with open(mcp_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    # Actualizar Supabase Project Ref
    if 'supabase' in config.get('mcpServers', {}):
        args = config['mcpServers']['supabase'].get('args', [])
        for i, arg in enumerate(args):
            if arg.startswith('--project-ref='):
                args[i] = f'--project-ref={project_ref}'
        config['mcpServers']['supabase']['args'] = args
        print(f"Actualizado project-ref a {project_ref}")

    with open(mcp_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=2)
    
    print("Archivo .mcp.json actualizado correctamente.")

if __name__ == "__main__":
    update_mcp_config()
