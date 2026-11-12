# Usar una imagen base de Node.js
FROM node:22-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación, incluyendo data.json
COPY . .

# Exponer el puerto en el que la aplicación se ejecutará
EXPOSE 5173

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev", "--", "--host"]