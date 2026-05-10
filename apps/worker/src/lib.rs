use serde::Serialize;
use worker::*;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    version: &'static str,
}

#[derive(Serialize)]
struct ApiError {
    error: String,
}

fn json_response<T: Serialize>(data: &T, status: u16) -> Result<Response> {
    let body = serde_json::to_string(data).unwrap();
    let headers = Headers::new();
    headers.set("Content-Type", "application/json")?;
    headers.set("Access-Control-Allow-Origin", "*")?;
    Ok(Response::ok(body)?
        .with_headers(headers)
        .with_status(status))
}

#[event(fetch)]
async fn fetch(req: Request, _env: Env, _ctx: Context) -> Result<Response> {
    console_error_panic_hook::set_once();

    let path = req.path();

    match path.as_str() {
        "/api/health" => {
            let resp = HealthResponse {
                status: "ok",
                version: env!("CARGO_PKG_VERSION"),
            };
            json_response(&resp, 200)
        }
        p if p.starts_with("/api/") => {
            let err = ApiError {
                error: format!("Not found: {}", p),
            };
            json_response(&err, 404)
        }
        _ => Response::ok(""),
    }
}
