from email.policy import default
from random import choices
from secrets import choice
from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    prouser = models.OneToOneField(User,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="profile/")

    def __str__(self):
        return self.prouser.username

class Category(models.Model):
    title = models.CharField(max_length= 250)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title

class Product(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,blank=True, null=True)
    image = models.ImageField(upload_to="products/")
    market_price = models.PositiveIntegerField()
    selling_price = models.PositiveIntegerField()
    description = models.TextField()

    def __str__(self):
        return self.title

class Cart(models.Model):
    customer = models.ForeignKey(Profile,on_delete=models.CASCADE)
    total = models.PositiveIntegerField()
    complit = models.BooleanField(default=False)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"cart=={self.id}==complit=={self.complit}"

class CartProduct(models.Model):
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    product = models.ManyToManyField(Product)
    price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()
    subtotal = models.PositiveIntegerField()
    
    def __str__(self):
        return f"Cart=={self.cart.id}==CartProduct=={self.id}==Qualtity=={self.quantity}"

ORDER_STATUS = {
    ("Order Received", "Order Received"),
    ("Order Processing", "Order Processing"),
    ("On The Way", "On The Way"),
    ("Order Completed", "Order Completed"),
    ("Order canceled", "Order canceled"),
}

class Order(models.Model):
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE)
    address = models.CharField(max_length=30) 
    mobile = models.CharField(max_length=15)
    email = models.CharField(max_length=50)
    total = models.PositiveIntegerField()
    discount = models.PositiveIntegerField()
    order_status = models.CharField(max_length=255, choices=ORDER_STATUS,default="Order Received")
    date = models.DateField(auto_now_add=True)
    payment = models.BooleanField(default=False, blank=True,null=True)

    def __str__(self):
        return f"cart=={self.id}==address=={self.address}==total=={self.total}==payment=={self.payment}==order_status=={self.order_status}"
