import { useState } from "react";

const Homepage = () => {
    const [formData, setFormData] = useState({
        title: "",
        surname: "",
        middleName: "",
        firstName: "",
        staffNo: "",
        maritalStatus: "",
        dob: "",
        gender: "",
        address: "",
        email: "",
        phone: "",
        passport: null,
    });

    const [dependants, setDependants] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dependantData, setDependantData] = useState({
        image: null,
        surname: "",
        othername: "",
        dob: "",
        gender: "Male",
        relationship: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, passport: e.target.files[0] }));
    };

    const handleDependantChange = (e) => {
        const { name, value } = e.target;
        setDependantData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDependantImage = (e) => {
        setDependantData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const addDependant = () => {
        if (dependantData.surname && dependantData.relationship) {
            setDependants((prev) => [...prev, dependantData]);
            setDependantData({
                image: null,
                surname: "",
                othername: "",
                dob: "",
                gender: "Male",
                relationship: "",
            });
            setShowModal(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", { ...formData, dependants });
        // Add your form submission logic here
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6">
                Company Scheme Registration
            </h1>
            <p className="text-gray-600 mb-6">
                Kindly Enter Your Personal Details Below
            </p>

            <form onSubmit={handleSubmit}>
                {/* Personal Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>
                        <select
                            name="title"
                            className="w-full border rounded p-2"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select ▼</option>
                            <option>Mr.</option>
                            <option>Mrs.</option>
                            <option>Ms.</option>
                            <option>Dr.</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Surname
                        </label>
                        <input
                            type="text"
                            name="surname"
                            className="w-full border rounded p-2"
                            placeholder="Enter Surname"
                            value={formData.surname}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Middle Name
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            className="w-full border rounded p-2"
                            placeholder="Enter MiddleName"
                            value={formData.middleName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            className="w-full border rounded p-2"
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Staff No
                        </label>
                        <input
                            type="text"
                            name="staffNo"
                            className="w-full border rounded p-2"
                            placeholder="Enter Staff Number"
                            value={formData.staffNo}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Marital Status
                        </label>
                        <select
                            name="maritalStatus"
                            className="w-full border rounded p-2"
                            value={formData.maritalStatus}
                            onChange={handleInputChange}
                        >
                            <option value="">Select ▼</option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dob"
                            className="w-full border rounded p-2"
                            value={formData.dob}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            className="w-full border rounded p-2"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select ▼</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            className="w-full border rounded p-2"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border rounded p-2"
                            placeholder="Enter Email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full border rounded p-2"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Passport Photo
                        </label>
                        <div className="border rounded p-2">
                            <input
                                type="file"
                                name="passport"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                {formData.passport
                                    ? formData.passport.name
                                    : "No file chosen"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dependants Section */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Dependants</h2>

                    {dependants.length > 0 && (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left">
                                            Image
                                        </th>
                                        <th className="border p-2 text-left">
                                            Surname
                                        </th>
                                        <th className="border p-2 text-left">
                                            Othername
                                        </th>
                                        <th className="border p-2 text-left">
                                            Date of Birth
                                        </th>
                                        <th className="border p-2 text-left">
                                            Gender
                                        </th>
                                        <th className="border p-2 text-left">
                                            Relationship
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dependants.map((dependant, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">
                                                {dependant.image?.name ||
                                                    "No file chosen"}
                                            </td>
                                            <td className="border p-2">
                                                {dependant.surname}
                                            </td>
                                            <td className="border p-2">
                                                {dependant.othername}
                                            </td>
                                            <td className="border p-2">
                                                {dependant.dob}
                                            </td>
                                            <td className="border p-2">
                                                {dependant.gender}
                                            </td>
                                            <td className="border p-2">
                                                {dependant.relationship}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add New Dependant
                    </button>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                        Submit All Records
                    </button>
                </div>
            </form>

            {/* Dependant Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Add New Dependant
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Passport Image
                                </label>
                                <div className="border rounded p-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDependantImage}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {dependantData.image?.name ||
                                            "No file chosen"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Surname
                                </label>
                                <input
                                    type="text"
                                    name="surname"
                                    className="w-full border rounded p-2"
                                    value={dependantData.surname}
                                    onChange={handleDependantChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Other Names
                                </label>
                                <input
                                    type="text"
                                    name="othername"
                                    className="w-full border rounded p-2"
                                    value={dependantData.othername}
                                    onChange={handleDependantChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="w-full border rounded p-2"
                                    value={dependantData.dob}
                                    onChange={handleDependantChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        className="w-full border rounded p-2"
                                        value={dependantData.gender}
                                        onChange={handleDependantChange}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Relationship
                                    </label>
                                    <input
                                        type="text"
                                        name="relationship"
                                        className="w-full border rounded p-2"
                                        value={dependantData.relationship}
                                        onChange={handleDependantChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={addDependant}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
