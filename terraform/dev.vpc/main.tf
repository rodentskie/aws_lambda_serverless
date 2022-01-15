data "aws_eip" "eip" {
  filter {
    name   = "tag:Name"
    values = ["rod-eks-${var.environment}"]
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.7.0"

  name = "rod-${var.environment}"
  cidr = var.cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true
  reuse_nat_ips        = true
  external_nat_ip_ids  = [data.aws_eip.eip.id]

  public_subnet_tags = {
    "kubernetes.io/role/elb"                           = "1"
    "kubernetes.io/cluster/rod-eks-${var.environment}" = "shared"
    Public                                             = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb"                  = "1"
    "kubernetes.io/cluster/rod-eks-${var.environment}" = "shared"
    Private                                            = "1"
  }

  tags = {
    Terraform   = "true"
    Project     = "rod"
    Environment = var.environment
  }
}


resource "aws_security_group" "mongo" {
  name   = "rod-aws-mongo-${var.environment}"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Terraform   = "true"
    Project     = "rod"
    Environment = var.environment
    Database    = "mongo"
  }
}
