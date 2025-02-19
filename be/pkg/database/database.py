import gridfs
from bson import ObjectId
from pymongo import MongoClient


class Database:
    def __init__(self, mongo_uri, db_name):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.fs = gridfs.GridFS(self.db)  # Initialize GridFS

    def get_collection(self, collection_name):
        return self.db[collection_name]

    def check_connection(self):
        try:
            self.client.server_info()  # Check if the server is available
            return True
        except Exception as e:
            return False

    def collection_exists(self, collection_name):
        return collection_name in self.db.list_collection_names()

    def store_file(self, file_data, filename):
        return self.fs.put(file_data, filename=filename)

    def get_file(self, file_id):
        try:
            file = self.fs.get(ObjectId(file_id))
            return file
        except gridfs.NoFile:
            return None

    def get_file_metadata(self, file_id):
        return self.fs.get(file_id)

    def delete_file(self, file_id):
        self.fs.delete(file_id)


# Example usage
MONGO_URI = ("mongodb+srv://rxtnmongo:IrSG6HwBLnGcQizM@rxt-service.xgsfc.mongodb.net/?retryWrites=true&w=majority&appName=RxT-Service")
    #("mongodb+srv://giri1208srinivas:mongouser@cluster0.extptud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    #("mongodb+srv://rxtnmongo:bwsbk3Z8j8mpyolI@rxt-service.xgsfc.mongodb.net/?retryWrites=true&w=majority&appName=RxT-Service")

DB_NAME = 'rxtn'

database = Database(MONGO_URI, DB_NAME)

user_collection = database.get_collection('users')

# print(database)
