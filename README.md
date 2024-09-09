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
#docker build -f Dockerfile -t dev-kolam-mat-sen-admin .   
#docker tag dev-kolam-mat-sen-admin devkolammatsenacr.azurecr.io/dev-kolam-mat-sen-admin
#docker push devkolammatsenacr.azurecr.io/dev-kolam-mat-sen-admin
#az acr login -n devkolammatsenacr
acr username devkolammatsenacr
acr password Nps63pVK+zAsNOw4mf601HtS1IRiLgk00PzZ95cjVz+ACRB/+Gah
docker build --platform=linux/amd64 -t dev-kolam-mat-sen-admin . 
docker build --no-cache --platform=linux/amd64 -t dev-kolam-mat-sen-admin .
