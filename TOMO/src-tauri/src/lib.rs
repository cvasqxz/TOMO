use tauri::{Emitter, Manager};
use std::thread;
use std::time::Duration;

#[cfg(not(any(target_os = "android", target_os = "ios")))]
use tauri_plugin_cli::CliExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_cli::init())
        .setup(|app| {
            #[cfg(not(any(target_os = "android", target_os = "ios")))]
            handle_cli_file_open(app);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Opens a file if provided via CLI argument
#[cfg(not(any(target_os = "android", target_os = "ios")))]
fn handle_cli_file_open(app: &tauri::App) {
    let app_handle = app.app_handle().clone();

    let file_path = if let Ok(matches) = app.cli().matches() {
        matches.args.get("file")
            .and_then(|arg| arg.value.as_str())
            .map(str::to_string)
    } else {
        // Fallback for dev mode: get args directly from std::env
        std::env::args()
            .find(|arg| arg.ends_with(".md") || arg.ends_with(".markdown"))
    };

    if let Some(path) = file_path {
        let absolute_path = if std::path::Path::new(&path).is_absolute() {
            path
        } else {
            match std::env::current_dir() {
                Ok(mut cwd) => {
                    if cwd.ends_with("src-tauri") {
                        cwd.pop();
                    }
                    cwd.join(&path).to_string_lossy().to_string()
                }
                Err(_) => path
            }
        };

        // Emit event after delay to ensure frontend listener is ready
        thread::spawn(move || {
            thread::sleep(Duration::from_millis(1000));

            if let Some(window) = app_handle.get_webview_window("main") {
                let _ = window.emit("cli-open-file", absolute_path);
            }
        });
    }
}
