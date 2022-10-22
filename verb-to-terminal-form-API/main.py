# -*- coding: utf-8 -*-

from deta import Deta
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import spacy

deta = Deta("c0922pnk_rYXNghNVtZxitPP2NUpERobCxVXaBkvi")
db = deta.Base('simpleDB')

app = FastAPI()

def lemmatization(target):
    nlp = spacy.load('ja_ginza')

    doc = nlp(target)

    input_ = doc[:].text
    lemma = doc[:].lemma_

    print("Input:        ", input_)
    print("Lemmatization:", lemma)

    return lemma

    # 出力
    # Input:         学校を出た。道を走り、家に帰ります。
    # Lemmatization: 学校を出るた。道を走る、家に帰るます。

class Input(BaseModel):
    sentence: str

@app.get("/{input}")
# input = {"sentence": '学校を出た。道を走り、家に帰ります。'}
async def index(input: str, responses={404: {"model": "input_not_found"}}):
    # if input == "":
    #     raise HTTPException(status_code=404, detail="input_not_found")
    return {"sentence": lemmatization(input)}
