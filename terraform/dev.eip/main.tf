resource "aws_eip" "eip" {
  vpc   = true

  tags = {
    Name        = "rod-eks-${var.environment}"
    Environment = var.environment
  }
}