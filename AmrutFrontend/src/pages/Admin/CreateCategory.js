import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import CategoryForm from "../../components/form/CategoryForm";
import { Modal } from "antd";

function CreateCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null); // Corrected declaration
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/category/create-category",
        { name }
      );
      if (data?.success) {
        toast.success(`${name} is Created`);
      } else if (data) {
        toast.error(data?.message);
      } else {
        toast.error(`Response Server is undefined`);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went Wrong in input form");
    }
  };

  //get All Category

  const getAllCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/category/get-category"
      );
      const data = response.data;
      console.log("Fetched Data", data);

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.category)) {
        setCategories(data.category);
      } else {
        console.log("Fetched data is not in the expected format:", data);
        toast.error("Data format error: Unexpected response format");
      }
    } catch (error) {
      console.log("Error Fetching categories", error);
      toast.error("Something Went Wrong in Getting categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []); // Ensure it runs only once on component mount

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };
  //delete category
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/category//delete-category/${id}`
      );
      if (data.success) {
        toast.success(`Category is deleted`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <button
                          className="btn btn-primary ms-2"
                          onClick={() => {
                            setVisible(true);
                            setUpdatedName(item.name);
                            setSelected(item); // You need to set the selected category here
                          }}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreateCategory;
