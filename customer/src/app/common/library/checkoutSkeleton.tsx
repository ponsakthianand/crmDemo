import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york/ui/card";
import { Label } from "@/registry/new-york/ui/label";
import { Separator } from "@radix-ui/react-separator";

export const CheckoutSkeleton = () => {
  return (
    <>
      <div className="flex-1 lg:space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg h-8 bg-gray-300 w-44 rounded-md animate-pulse"></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="h-3 bg-gray-300 rounded-md animate-pulse block w-14"></Label>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="phone" className="h-3 bg-gray-300 rounded-md animate-pulse block w-14"></Label>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="email" className="h-3 bg-gray-300 rounded-md animate-pulse block w-14"></Label>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <div className="h-10 w-36 bg-gray-300 rounded-[50px] animate-pulse"></div>
        </div>
      </div>
      <div className="w-full max-w-md space-y-6 md:w-[500px]">
        <h1 className="text-2xl font-bold tracking-tight hidden lg:block">&nbsp;</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg h-8 bg-gray-300 w-44 rounded-md animate-pulse"></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 min-h-50">
            <div className="min-h-[180px] space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  className="grid grid-cols-[1fr_auto] gap-4 animate-pulse"
                  key={index}
                >
                  <div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-md w-20"></div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded-md w-20"></div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-5 block lg:hidden">
          <div className="h-10 w-full bg-gray-200 rounded-[50px] animate-pulse"></div>
        </div>
      </div>
    </>

  );
};