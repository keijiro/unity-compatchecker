#pragma strict

import Mono.Cecil;
import System.IO;

class MonoCompatCheckerWindow extends EditorWindow {
    var profiles : String[] = ["2.0", "micro", "unity", "unity_web"];
    var profileIndex = 0;

    var assemblies : AssemblyDefinition[];

    var className = "";
    var matchedClassName = "";
    var exactMatch = false;

    var result = "";
    var scroll = Vector2.zero;

    @MenuItem ("Window/Mono Compatibility Checker")
    static function MonoCompatCheckerMenuItem () {
        var window = ScriptableObject.CreateInstance.<MonoCompatCheckerWindow>();
        window.title = "Mono Compat";
        window.ReloadAssemblies();
        window.Show();
    }
    
    function OnGUI () {
        EditorGUILayout.BeginHorizontal();
        GUILayout.Label("Profile");
        var newProfileIndex = EditorGUILayout.Popup(profileIndex, profiles);
        EditorGUILayout.EndHorizontal();

        var newClassName = EditorGUILayout.TextField("Class name", className);
        var newExactMatch = EditorGUILayout.Toggle("Match exactly", exactMatch);

        if (newProfileIndex != profileIndex) {
            profileIndex = newProfileIndex;
            ReloadAssemblies();
            className = "";
        }

        if (newClassName != className || newExactMatch != exactMatch) {
            className = newClassName;
            exactMatch = newExactMatch;
            DoSearch();
        }

        EditorGUILayout.LabelField("Matched class name", matchedClassName);

        scroll = EditorGUILayout.BeginScrollView(scroll);
        EditorGUILayout.TextArea(result);
        EditorGUILayout.EndScrollView();
    }

    function GetMonoLibPath() {
        var base = EditorApplication.applicationContentsPath;
        // (Windows)
        var libPath = Path.Combine(base, "Mono/lib/mono");
        if (Directory.Exists(libPath)) return libPath;
        // (Mac)
        return Path.Combine(base, "Frameworks/Mono/lib/mono");
    }

    function ReloadAssemblies() {
        var dllPath = Path.Combine(GetMonoLibPath(), profiles[profileIndex]);
        var dllFiles = Directory.GetFiles(dllPath, "*.dll");
        assemblies = new AssemblyDefinition[dllFiles.Length];
        for (var i = 0; i < dllFiles.Length; i++) {
            assemblies[i] = AssemblyDefinition.ReadAssembly(dllFiles[i]);
        }
    }

    function DoSearch() {
        result = "";
        scroll = Vector2.zero;

        for (var asm in assemblies) {
            for (var type in asm.MainModule.Types) {
                var typeName = type.ToString();

                if ((!exactMatch && typeName.Contains(className)) || className == typeName) {
                    matchedClassName = typeName;

                    for (var method in type.Methods) {
                        if (method.IsPublic && method.HasBody) {
                            result += method;

                            for (var attr in method.CustomAttributes) {
                                result += " [" + attr.AttributeType.Name + "]";
                            }

                            result += "\n";
                        }
                    }
                    return;
                }
            }

            matchedClassName = "not found";
        }
    }
}
