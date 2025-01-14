from fastapi import APIRouter, HTTPException, Depends, security, BackgroundTasks
from sqlalchemy.orm import Session

from database import get_db
from utils import update_data
import crud as crud
import schemas as schemas
import utils as utils

router = APIRouter(
    tags=['User'],
    prefix='/user'
)


@router.post("/register")
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = crud.create_user(db=db, user=user)

    return await crud.create_token(db, user)


@router.post("/token")
async def generate_token(
    form_data: security.OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = await crud.authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    return await crud.create_token(db, user)


@router.get("/me", response_model=schemas.User)
async def get_user(user: schemas.User = Depends(crud.get_current_user)):
    return user


@router.get("/places")
async def get_user_created_places(db: Session = Depends(get_db),
                                  user: schemas.User = Depends(crud.get_current_user)):
    return await utils.get_user_created_places(user, db)


@router.delete("/places/{place_id}", status_code=204)
async def delete_created_place(background_tasks: BackgroundTasks,
                               place_id: int,
                               db: Session = Depends(get_db),
                               user: schemas.User = Depends(crud.get_current_user)):
    removed_images = await crud.delete_place(db, user, place_id)
    background_tasks.add_task(update_data, removed_images)

    return {"message", "Successfully Deleted"}
