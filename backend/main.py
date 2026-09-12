from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

from database import contacts_collection


app = FastAPI()


class Telephone(BaseModel):
    mobile: str
    home: str


class Contact(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True
    )

    id: str | None = Field(
        default=None,
        alias="_id"
    )

    username: str
    email: str
    telephone: Telephone


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/v1/contact",
    response_model=list[Contact],
    response_model_by_alias=True
)
def get_contacts() -> list[Contact]:
    contacts = list(contacts_collection.find())

    result: list[Contact] = []

    for c in contacts:
        c["_id"] = str(c["_id"])
        result.append(Contact(**c))

    return result


@app.post(
    "/v1/contact",
    response_model=Contact,
    response_model_by_alias=True
)
def create_contact(c: Contact) -> Contact:
    data = c.model_dump(
        exclude={"id"},
        by_alias=True
    )

    res = contacts_collection.insert_one(data)

    data["_id"] = str(res.inserted_id)

    return Contact(**data)


@app.get(
    "/v1/contact/{uid}",
    response_model=Contact,
    response_model_by_alias=True
)
def get_contact(uid: str) -> Contact:
    try:
        contact = contacts_collection.find_one(
            {"_id": ObjectId(uid)}
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Incorrect ID"
        )

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Not found contact"
        )

    contact["_id"] = str(contact["_id"])

    return Contact(**contact)


@app.put(
    "/v1/contact/{uid}",
    response_model=Contact,
    response_model_by_alias=True
)
def update_contact(
    uid: str,
    contact: Contact
) -> Contact:
    try:
        object_id = ObjectId(uid)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Incorrect ID"
        )

    data = contact.model_dump(
        exclude={"id"},
        by_alias=True
    )

    res = contacts_collection.update_one(
        {"_id": object_id},
        {"$set": data}
    )

    if res.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Not found contact"
        )

    updated_contact = contacts_collection.find_one(
        {"_id": object_id}
    )

    if updated_contact is None:
        raise HTTPException(
            status_code=404,
            detail="Not found contact"
        )

    updated_contact["_id"] = str(updated_contact["_id"])

    return Contact(**updated_contact)


@app.delete("/v1/contact/{uid}")
def delete_contact(uid: str) -> str:
    try:
        object_id = ObjectId(uid)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Incorrect ID"
        )

    res = contacts_collection.delete_one(
        {"_id": object_id}
    )

    if res.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Not found contact"
        )

    return uid
