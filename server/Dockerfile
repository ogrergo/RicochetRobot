FROM python:3.10-alpine

COPY . .
RUN python3 -m pip install -r requirements.txt

ENTRYPOINT ["python3"]
CMD ["app.py"]

