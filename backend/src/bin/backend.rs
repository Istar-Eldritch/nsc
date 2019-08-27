use actix_files as fs;
use actix_web::{web, App, HttpResponse, HttpServer, Result};
use dotenv::dotenv;
use std::env;

fn frontend() -> Result<fs::NamedFile> {
    let fe_static = env::var("FE_STATIC").expect("Must provide FE_STATIC environment variable pointing to the foler with frontend static files");
    Ok(fs::NamedFile::open(format!(
        "{}{}",
        fe_static, "/index.html"
    ))?)
}

fn health() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().body("Ok".to_string()))
}

fn main() {
    dotenv().ok();

    let port = env::var("PORT").expect("Must provide PORT environment variable");
    let addr = format!("0.0.0.0:{}", port);

    HttpServer::new(|| {
        // Frontend routing
        //
        let api = web::scope("/api/").route("/health", web::get().to(health));

        App::new()
            .route("/", web::get().to(frontend))
            .service(fs::Files::new(
                "/static",
                env::var("FE_STATIC").expect("Must provide FE_STATIC environment variable pointing to the foler with frontend static files"),
            ).index_file("index.html"))
            .service(api)
            .route("/.*", web::get().to(frontend))
    })
    .bind(&addr)
    .expect(&format!("Can not bind to port {}", port))
    .run()
    .unwrap();
}
