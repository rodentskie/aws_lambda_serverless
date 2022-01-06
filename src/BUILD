load("@build_bazel_rules_nodejs//:index.bzl", "npm_package_bin")
load("@npm//@bazel/typescript:index.bzl", "ts_config", "ts_project")

package(default_visibility = ["//visibility:public"])


deps = [
    "@npm//@koa/cors",
    "@npm//@koa/router",
    "@npm//basic-auth",
    "@npm//bcrypt",
    "@npm//chai",
    "@npm//dotenv",
    "@npm//faker",
    "@npm//jsonwebtoken",
    "@npm//koa",
    "@npm//koa-bodyparser",
    "@npm//mocha",
    "@npm//mongoose",
    "@npm//ramda",
    "@npm//supertest",
]

type_deps = [
    "@npm//@types/basic-auth",
    "@npm//@types/bcrypt",
    "@npm//@types/chai",
    "@npm//@types/dotenv",
    "@npm//@types/faker",
    "@npm//@types/jsonwebtoken",
    "@npm//@types/koa",
    "@npm//@types/koa-bodyparser",
    "@npm//@types/koa__cors",
    "@npm//@types/koa__router",
    "@npm//@types/mocha",
    "@npm//@types/mongoose",
    "@npm//@types/ramda",
    "@npm//@types/supertest",
]

dev_deps = [
    "@npm//@commitlint/cli",
    "@npm//@commitlint/config-conventional",
    "@npm//@typescript-eslint/eslint-plugin",
    "@npm//@typescript-eslint/parser",
    "@npm//eslint",
    "@npm//eslint-config-airbnb-typescript",
    "@npm//eslint-import-resolver-typescript",
    "@npm//eslint-config-prettier",
    "@npm//eslint-plugin-import",
    "@npm//eslint-plugin-prettier",
    "@npm//husky",
    "@npm//prettier",
    "@npm//ts-node",
    "@npm//typescript"
]

ts_config(
    name = "config",
    src = "tsconfig.json"
)

ts_project(
    name = "build",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*spec.ts",
            "tests/**/*.*",
            "node_modules/**/*.*",
        ],
    ),
    declaration = True,
    declaration_map = True,
    source_map = True,
    tsconfig = "tsconfig.json",
    deps = deps + type_deps + dev_deps,
)

npm_package_bin(
    name = "lint",
    args = [
        ".",
        "--ext .ts",
    ],
    chdir = package_name(),
    data = glob(["**/*.ts"]) + deps + type_deps + dev_deps + [
        "//:package.json",
        "//:tsconfig.json",
        "//:.eslintrc",
        "//:.eslintignore",
    ],
    output_dir = True,
    tool = "@npm//eslint/bin:eslint",
)
