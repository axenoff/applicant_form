#!/usr/bin/env bash

rm -rf public/applicant/static
mkdir -p public/applicant
cd client/applicant && npm install && npm run build && cp -r build/* ../../public/applicant && cd -
