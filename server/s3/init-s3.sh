#!/bin/bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://hanaro-public
aws --endpoint-url=http://localhost:4566 s3 mb s3://hanaro-private

