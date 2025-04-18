import React from "react";

const Modal = ({
    showModal,
    setShowModal,
    dependantData,
    handleDependantChange,
    handleDependantImage,
    handleAddDependant,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add New Dependant</h3>
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleDependantImage}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Surname
                        </label>
                        <input
                            type="text"
                            name="surname"
                            className="border rounded p-2 w-full"
                            value={dependantData.surname}
                            onChange={handleDependantChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Other Names
                        </label>
                        <input
                            type="text"
                            name="othername"
                            className="border rounded p-2 w-full"
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
                            className="border rounded p-2 w-full"
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
                                className="border rounded p-2 w-full"
                                value={dependantData.gender}
                                onChange={handleDependantChange}
                            >
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Marital Status
                            </label>
                            <select
                                name="maritalStatus"
                                className="border rounded p-2 w-full"
                                value={dependantData.maritalStatus}
                                onChange={handleDependantChange}
                            >
                                <option value="">Select</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Divorced</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Relationship
                        </label>
                        <input
                            type="text"
                            name="relationship"
                            className="border rounded p-2 w-full"
                            value={dependantData.relationship}
                            onChange={handleDependantChange}
                        />
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
                        onClick={handleAddDependant}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
