terraform {
  backend "s3" {
    bucket = "rod-terraform"
    key    = "eip.tfstate"
    region = "ap-southeast-1"
  }
}
