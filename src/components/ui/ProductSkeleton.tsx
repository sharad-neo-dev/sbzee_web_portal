import { Card, CardContent } from "@/components/ui/card";

export function ProductSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Skeleton */}
          <div>
            <div className="h-96 lg:h-[500px] w-full bg-gray-200 rounded-xl animate-pulse mb-4" />
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div>
            <Card className="mb-4">
              <CardContent className="p-6">
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse mb-3" />
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <div className="flex gap-4 mb-8">
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 flex-1 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
