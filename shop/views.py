from multiprocessing import context
from rest_framework import generics, mixins , viewsets, views
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import *
from .serializers import *

            
class ProductView(generics.GenericAPIView, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers
    lookup_field = "id"
    def get(self, request, id=None):
        if id:
            return self.retrieve(request)
        else:
            return self.list(request)
    

class CategoryView(viewsets.ViewSet):
    def list(self, request):
        query_set = Category.objects.all().order_by("-id")
        serializer_data = CategorySerializers(query_set, many=True)
        return Response(serializer_data.data)
    
    def retrieve(self, request, pk=None):
        query_set = Category.objects.get(id=pk)
        serializer  = CategorySerializers(query_set)
        serializer_data = serializer.data
        all_data = []
        category_product = Product.objects.filter(category_id=serializer_data['id'])
        category_product_serializers = ProductSerializers(category_product, many=True)
        serializer_data['category_product'] = category_product_serializers.data
        all_data.append(serializer_data)
        return(all_data)


class ProfileView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            query_set = Profile.objects.get(prouser=request.user)
            serializers_data = ProfileSerializers(query_set)
            context = {
                'error':False,
                'data': serializers_data.data
            }
            return Response(context)
        except:
             context= {
                    'error': False,
                    'msg': "Product Update Not Found"
                }
             return Response(context)


class UserUpdateData(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            data = request.data

            user_obj = User.objects.get(username= user)
            user_obj.first_name = data['first_name']
            user_obj.last_name = data['last_name']
            user_obj.email = data['email']
            user_obj.save()
            context = {
                'error': False,
                'msg': "user is geted"
            }
            return Response(context)
        except Exception as e:
            context = {
                'error': True,
                'msg': "User is worng"
            }
            return Response(context)


class ProfileImageUpdate(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            query_set = Profile.objects.get(prouser=user)
            data = request.data
            serializers = ProfileSerializers(query_set, data=data, context={'request':request})
            serializers.is_valid()
            serializers.save()
            context = {
                'error': False,
                'msg': "Image update successfully"
            }
            return Response(context)
        except Exception as e:
            context = {
                'error': True,
                'msg': "Somthing is worng !! Image not update"
            }
            return Response(context)
        

class CartViews(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        query_set = Cart.objects.filter(customer= request.user.profile)
        serializers_data = CartSerializers(query_set, many=True)
        all_data = []
        for cart in serializers_data:
            cart_product = CartProduct.objects.filter(cart=cart['id'])
            cart_product_serializers = CartProductSerializers(cart_product,many=True)
            cart["cartproduct"]= cart_product_serializers.data
            all_data.append(cart)
        return Response(all_data)

class OrderView(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        query_set = Order.objects.filter(cart__customer = request.user.profile)
        serializers = OrderSerializers(query_set, many=True)
        all_data = []
        for order in serializers.data:
            order_product = CartProduct.objects.filter(order_id= order['cart']['id'])
            order_product_serializers = CartProductSerializers(order_product, many=True)
            serializers['cartproduct'] = order_product_serializers.data
            all_data.append(serializers)
            return Response(all_data)

    def create(self, request):
        try:
            data = request.data
            cart_id = data['cartid']
            address = data['address']
            mobile = data['mobile']
            email = data['email']

            cart_obj = Cart.objects.all(id=cart_id, complit = True)
            cart_obj.save()
            Order.objects.create(
                cart = cart_obj,
                address = address,
                mobile = mobile,
                email = email,
                discount = 3
            )
            context = {
                'error': False,
                'msg': "data create ok"
            }
            return Response(context)
        except Exception as e:
            context = {
                'error': True,
                'msg': "Something is worng"
            }
            return Response(context)


    def distroy(self, request, pk= None):
        try:
            order_obj = Order.objects.all(id=pk)
            cart_obj = Cart.objects.filter(id= order_obj.cart.id)
            order_obj.delete()
            cart_obj.delete()
            context = {
                'error': False,
                'msg': "Order is delete"
            }
            return Response(context)
        except Exception as e:
            context = {
                'error': True,
                'msg': "Something Worng"
            }
            return Response(context)

    def retrieve(self, request, pk=None):
        try:
            query_set = Order.objects.get(id=pk)
            serializers = OrderSerializers(query_set)
            serializers_data = serializers.data
            all_data = []
            for cart in serializers_data:
                cart_product = CartProduct.objects.filter(cart_id = cart['cart']['id'])
                cart_product_serializer = CartProductSerializers(cart_product, many=True)
                cart['cartproduct'] = cart_product_serializer.data
                all_data.append(cart)
                context = {
                    'error': False,
                    'msg': 'Data list successfully'
                }
                return Response(context, all_data)
        except Exception as e:
            context = {
                'error': True,
                'msg': "Data list not found"
            }
            return Response(context)
    
    
class AddCartViews(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            product_id = request.data['id']
            product_obj = Product.objects.filter(id=product_id)
            cart_cart = Cart.objects.filter(product=request.user.profile).filter(complit=False)
            product_cart_obj = CartProduct.objects.filter(product__id=product_id).filter(complit=False).first()

            if cart_cart:
                this_product_in_cart = cart_cart.cartproduct_set.filter(product=product_obj)
                if this_product_in_cart.exists():
                    cartprod_uct = CartProduct.objects.filter(product=product_obj).filter(cart__complit=False).first()
                    cartprod_uct.quantity = 1,
                    cartprod_uct.subtotal = product_obj.selling_price
                    cartprod_uct.total += product_obj.selling_price
                    cartprod_uct.save()
                    cart_cart.total += product_obj.selling_price
                    cart_cart.save()
                else:
                    new_cart_product = CartProduct.objects.create(
                        cart = cart_cart,
                        price = product_obj.selling_price,
                        quantity = 1,
                        subtotal = product_obj.selling_price
                    )
                    new_cart_product.product.add(product_obj)
                    new_cart_product.total += product_obj.selling_price
                    new_cart_product.save()
            else:
                Cart.objects.filter(customer=request.user.profile, total=0)
                new_cart = Cart.objects.filter(customer=request.user.profile).filter(complit=False).first()
                new_cart_product = CartProduct.objects.create(
                    cart = new_cart,
                    price = product_obj.selling_price,
                    quantity = 1,
                    subtotal = product_obj.selling_price
                    )
                new_cart_product.product.add(product_obj)
                new_cart_product.total += product_obj.selling_price
                new_cart.save()
            context = {
                'error': False,
                'msg': "product cart successfull"
            }
            return Response(context)

        except Exception as e:
            context = {
                'error': True,
                'msg': "product cart not found"
            }
            return Response(context)

class CartUpdateView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart_product_id = request.data['id']
            cart_product = CartProduct.objects.filter(id=cart_product_id)
            cart_obj = cart_product.cart

            cart_product.quantity += 1,
            cart_product.subtotal += cart_obj.price
            cart_product.save()

            cart_obj.total += cart_product.price
            cart_obj.save()

            context = {
                'error': False,
                'msg': "cart now update"
            }
            return Response(context)
        except Exception as e:
            context = {
                'error': True,
                'msg': "cart did'nt update"
            }
            return Response(context)

class CartEditView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart_product_id = request.data['id']
            cart_product = CartProduct.objects.filter(id=cart_product_id)
            cart_obj = cart_product.cart

            cart_product.quantity -= 1,
            cart_product.subtotal -= cart_obj.price
            cart_product.total -= cart_obj.price
            cart_obj.save()

            cart_obj.total -= cart_product.price
            cart_obj.save()
            if(cart_product.quantity==0):
                cart_product.delete()
            context = {
                'error': False,
                'msg': "cart updated"
            }
            return Response(context)

        except Exception as e:
            context = {
                'error': True,
                'msg': "cart did'nt updated"
            }
            return Response(context)

class CartDelete(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_product_id = request.data['id']
        cart_product = CartProduct.objects.filter(id=cart_product_id)
        cart_product.delete()
        context = {
            'msg': "cart product is deleted"
        }
        return Response(context)

class CartDeleteView(views.APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            cart_id = request.data["id"]
            product_id = Cart.objects.filter(id=cart_id)
            product_id.delete()
            context = {
                'error': False,
                'msg': "cart delete done"
            }
            return Response(context)
        except Exception as e:
             context = {
                'error': True,
                'msg': "cart delete done"
            }
        return(context)

class Registerview(views.APIView):
    def post(self, request):
        serializers_data = UserSerializers(data=request.data)
        if serializers_data.is_valid():
            serializers_data.save()
            context = {
                'error': False,
                'msg': f"user is created for {serializers_data['username']}"
            }
            return Response(context)
        context = {
            'error': False,
            'msg': "Something is worng"
        }
        return Response(context)