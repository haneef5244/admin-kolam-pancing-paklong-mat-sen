This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prisma
To create table
npx prisma migrate dev --name init
npx prisma generate
npx prisma db push

To run seed
npx prisma db seed

## Deploy on app service

#deployment scripts
#docker build -f Dockerfile -t kolam-mat-sen-admin .   
#docker tag kolam-mat-sen-admin kolammatsenacr.azurecr.io/kolam-mat-sen-admin
#docker push kolammatsenacr.azurecr.io/kolam-mat-sen-admin
#az acr login -n kolammatsenacr
acr username kolammatsenacr
acr password aNV4VKhtepkCu0W+sAPmd1gYBTf6/OjgoI8Y6hCOCy+ACRCXCiNI
docker build --platform=linux/amd64 -t kolam-mat-sen-admin . 
docker build --no-cache --platform=linux/amd64 -t kolam-mat-sen-admin .
