import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Users, Package, Shield, Trash2, Eye, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useUserProfiles } from "@/hooks/useUserProfiles";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { products, loading: productsLoading, fetchProducts, deleteProduct } = useProducts();
  const { profiles, loading: usersLoading, updateUserRole, deleteUser, blockUser } = useUserProfiles();
  const [activeTab, setActiveTab] = useState("users");

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'block' | 'delete' | 'admin' | 'user') => {
    try {
      switch (action) {
        case 'block':
          await blockUser(userId);
          break;
        case 'delete':
          await deleteUser(userId);
          break;
        case 'admin':
          await updateUserRole(userId, 'admin');
          break;
        case 'user':
          await updateUserRole(userId, 'user');
          break;
      }
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Navbar />
        
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Admin <span className="text-emerald-400">Panel</span>
            </h1>
            <p className="text-gray-400">
              Manage users and products
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-900/50 border-gray-800">
              <TabsTrigger value="users" className="text-white data-[state=active]:bg-emerald-600">
                <Users className="h-4 w-4 mr-2" />
                Users ({profiles.length})
              </TabsTrigger>
              <TabsTrigger value="products" className="text-white data-[state=active]:bg-emerald-600">
                <Package className="h-4 w-4 mr-2" />
                Products ({products.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              {usersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((user) => (
                    <Card key={user.id} className="bg-gray-900/50 border-gray-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">
                            {user.first_name || user.last_name 
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : user.email.split('@')[0]
                            }
                          </CardTitle>
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : user.role === 'blocked' ? 'destructive' : 'secondary'}
                            className={
                              user.role === 'admin' 
                                ? 'bg-emerald-600 text-white' 
                                : user.role === 'blocked' 
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-600 text-white'
                            }
                          >
                            {user.role}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-400">
                          {user.email}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-400">
                            Joined: {formatDate(user.created_at)}
                          </p>
                          <p className="text-sm text-gray-400">
                            User ID: {user.clerk_user_id.slice(0, 15)}...
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {user.role !== 'blocked' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                                  <Ban className="h-3 w-3 mr-1" />
                                  Block
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Block User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will block the user from accessing the platform. Are you sure?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleUserAction(user.id, 'block')}>
                                    Block User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          
                          {user.role !== 'admin' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUserAction(user.id, 'admin')}
                              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Make Admin
                            </Button>
                          )}
                          
                          {user.role === 'admin' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUserAction(user.id, 'user')}
                              className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                            >
                              Remove Admin
                            </Button>
                          )}
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the user and all their data. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleUserAction(user.id, 'delete')}>
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              {productsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-gray-900/50 border-gray-800">
                      <CardHeader className="p-4">
                        <div className="relative">
                          <img 
                            src={product.images?.[0] || "/placeholder.svg"} 
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-lg bg-muted"
                          />
                          <Badge 
                            className={`absolute top-2 left-2 ${
                              product.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                            }`}
                          >
                            {product.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardTitle className="text-lg mb-2 line-clamp-2 text-white">{product.title}</CardTitle>
                        <CardDescription className="text-sm mb-3 line-clamp-2 text-gray-400">
                          {product.description}
                        </CardDescription>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-emerald-400">
                              ₹{product.price}
                            </span>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">{product.category}</Badge>
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            <p>Location: {product.location}</p>
                            <p>Views: {product.views_count || 0}</p>
                            <p>Listed: {formatDate(product.created_at)}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="flex-1">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this product? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                  Delete Product
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}