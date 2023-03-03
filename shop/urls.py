from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import *

router = DefaultRouter()
router.register("category", CategoryView, basename="categoriview"),
router.register("cart", CartViews, basename="cart"),
router.register("order", OrderView, basename="order"),

urlpatterns = [
        path('', include(router.urls)),
        path("product/",ProductView.as_view(),name="product"),
        path("product/<int:id>/",ProductView.as_view(),name="product"),
        path("profile/",ProfileView.as_view(),name="profile"),
        path("user/",UserUpdateData.as_view(),name="user"),
        path("profileview/",ProfileImageUpdate.as_view(),name="profileview"),
        path("addcart/",AddCartViews.as_view(),name="addcart"),
        path("cartupdate/",CartUpdateView.as_view(),name="cartupdate"),
        path("cartedit/",CartEditView.as_view(),name="cartedit"),
        path("cartdl/",CartDelete.as_view(),name="cartdl"),
        path("cartdelete/",CartDeleteView.as_view(),name="cartdelete"),
        path("register/",Registerview.as_view(),name="register"),
]