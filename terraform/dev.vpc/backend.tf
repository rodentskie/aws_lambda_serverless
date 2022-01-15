terraform {
  backend "s3" {
    bucket = "rod-terraform"
    key    = "vpc.tfstate"
    region = "ap-southeast-1"
  }
}
