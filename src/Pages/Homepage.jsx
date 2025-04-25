import React, { useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CgLogOut } from "react-icons/cg";

const Homepage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [title, setTitle] = useState([]);
    const [marital, setMarital] = useState([]);
    const [company, setCompany] = useState([]);
    const [scheme, setScheme] = useState([]);
    const [gender, setGender] = useState([]);
    const [apiSuccessModal, setApiSuccessModal] = useState(false);
    const [allResponses, setAllResponses] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [enrolleeData, setEnrolleeData] = useState({
        uniqueMembershipNo: "",
    });
    const [bioData, setBiodata] = useState([]);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [users, setUser] = useState("");

    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    const user = JSON.parse(localStorage.getItem("user"));

    console.log("user", user);

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
        company: "",
        scheme: "",
        startdate: "",
        schemeid: "",
    });

    const [dependants, setDependants] = useState([]);
    const [modalResponses, setModalResponses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dependantData, setDependantData] = useState({
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
        company: "",
        scheme: "",
        startdate: "",
    });
    const [relationship, setRelationship] = useState([]);

    const Submit = async () => {
        setIsSubmitting(true);
        const allResponses = [];

        const postData = {
            AddBeneficiary: [
                {
                    groupid: formData.company,
                    MemberShipNo: "",
                    Parent_Cif: "",
                    Cif_number: "",
                    OfflineID: formData.staffNo,
                    FirstName: formData.firstName,
                    Surname: formData.surname,
                    DateOfBirth: formData.dob,
                    Sex_ID: formData.gender,
                    MaritalStatus: formData.maritalStatus,
                    EmailAdress: formData.email,
                    Home_Phone: formData.phone,
                    Work_Phone: formData.phone,
                    Mobile: formData.phone,
                    Mobile2: formData.phone,
                    Hospital: "",
                    Scheme: formData.scheme,
                    Postal_Phone: formData.phone,
                    Physical_Add1: formData.address,
                    Postal_Town_ID: "",
                    Relationship_ID: 30,
                    BloodGroup: "",
                    PreExistingCondition: "",
                    EnrolleePictureType:
                        formData.passport?.type?.split("/")[1] || "jpeg",
                    EnrolleePicture: `data:${formData.passport?.type};base64,${formData.passport?.base64}`,

                    genotype: "",
                    othernames: "",
                    regionid: "",
                    schemeid: formData.schemeId,
                    startdate: formData.startdate,
                    registrationsource: "Web",
                    usercaptured: user?.result[0]?.UserName,
                },
            ],
        };
        let filteredResponses = [];
        console.log(" Principal API sent:", JSON.stringify(postData, null, 2));
        try {
            const response = await fetch(
                `${apiUrl}/api/EnrolleeProfile/AddBeneficiaryList`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData),
                },
            );

            const data = await response.json();

            console.log(
                " Principal API Response:",
                JSON.stringify(data, null, 2),
            );

            const uniqueNo = data.Enrollee_Numbers?.[0]?.UniqueMembershipNo;
            setEnrolleeData(uniqueNo);

            // Extract only principal info
            const principalInfo = {
                UniqueMembershipNo: uniqueNo || "N/A",
                EnrolleeName: data.Enrollee_Numbers?.[0]?.EnrolleeName || "N/A",
            };

            allResponses.push(principalInfo);

            if (data.status !== 200) {
                const errorMessages = [];

                // Check for errors in Enrollee_Numbers array
                if (Array.isArray(data?.Enrollee_Numbers)) {
                    data.Enrollee_Numbers.forEach((enrollee) => {
                        if (enrollee?.ErrorMessage) {
                            errorMessages.push(enrollee.ErrorMessage);
                        }
                    });
                }

                // Check for errors in result array
                if (Array.isArray(data?.result)) {
                    data.result.forEach((item) => {
                        if (item?.ErrorMessage) {
                            errorMessages.push(item.ErrorMessage);
                        }
                    });
                }

                // Check for top-level message
                if (data?.message && !errorMessages.includes(data.message)) {
                    errorMessages.push(data.message);
                }

                // Fallback if no errors found
                const errorMsg =
                    errorMessages.length > 0
                        ? errorMessages.join(", ")
                        : `Unexpected response: ${JSON.stringify(data)}`;

                setErrorMessage(errorMsg);
                setErrorModal(true);
            }

            // Now fetch biodata and submit dependants
            if (uniqueNo) {
                const bioResponse = await fetch(
                    `${apiUrl}api/EnrolleeProfile/GetEnrolleeBioDataByEnrolleeID?enrolleeid=${uniqueNo}`,
                    { method: "GET" },
                );

                const bioDataJson = await bioResponse.json();
                const parentId =
                    bioDataJson.result?.[0]?.Member_ParentMemberUniqueID;
                setBiodata(parentId);

                if (parentId) {
                    const dependantResponses =
                        await submitDependantsSequentially(uniqueNo, parentId);
                    allResponses.push(...dependantResponses);
                }
            }

            console.log(" Summary of Submitted Members:");
            allResponses.forEach((res, index) => {
                console.log(`#${index + 1}:`, res);
            });

            filteredResponses = allResponses.filter((response) => {
                // Only include responses that don't have both fields as 'N/A'
                return !(
                    response.UniqueMembershipNo === "N/A" &&
                    response.EnrolleeName === "N/A"
                );
            });
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setIsSubmitting(false);
            if (filteredResponses.length > 0) {
                setAllResponses(filteredResponses);
                setApiSuccessModal(true);
            } else {
                console.log("No valid responses to display");
            }
        }
    };

    useEffect(() => {
        GetTitle();
        GetMaritalStatus();
        GetCompany();
        Gender();
        GetRelationship();
    }, []);

    const AddBeneficiary = async () => {
        const postData = {
            AddBeneficiary: [
                {
                    groupid: formData.company,
                    MemberShipNo: enrolleeData,
                    Parent_Cif: bioData,
                    Cif_number: "",
                    OfflineID: formData.staffNo,
                    FirstName: dependantData.firstName,
                    Surname: dependantData.surname,
                    DateOfBirth: dependantData.dob,
                    Sex_ID: dependantData.gender,
                    MaritalStatus: "",
                    EmailAdress: formData.email,
                    Home_Phone: formData.phone,
                    Work_Phone: formData.phone,
                    Mobile: formData.phone,
                    Mobile2: formData.phone,
                    Hospital: "",
                    Scheme: formData.scheme,
                    Postal_Phone: formData.phone,
                    Physical_Add1: formData.address,
                    Postal_Town_ID: "",
                    Relationship_ID: dependantData.relationship,
                    BloodGroup: "",
                    PreExistingCondition: "",
                    EnrolleePictureType: "jpeg",
                    EnrolleePicture: "data:image/jpeg;base64,...",
                    genotype: "",
                    othernames: "",
                    regionid: "",
                    schemeid: formData.schemeId,
                    startdate: formData.startdate,
                    registrationsource: "Web",
                    usercaptured: "firstbillspay@firstbankgroup.com",
                },
            ],
        };

        console.log(
            "Sending beneficiary to API:",
            JSON.stringify(postData, null, 2),
        );

        try {
            const response = await fetch(
                `${apiUrl}/api/EnrolleeProfile/AddBeneficiaryList`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                },
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 200 && data.VisitID) {
                alert(`Visit ID ${data.VisitID} generated successfully!`);
                setVisitId(data.VisitID);
            } else {
                alert(`Unexpected response: ${JSON.stringify(data)}`);
            }

            SetData(data);
            console.log("Success:", data);
        } catch (error) {
            console.error("Error submitting data:", error);
        } finally {
        }
    };

    useEffect(() => {
        if (enrolleeData != null) {
            GetEnrolleeBiodata(enrolleeData);
        }
    }, [enrolleeData]);

    async function GetEnrolleeBiodata(enrolleeData) {
        try {
            const response = await fetch(
                `${apiUrl}api/EnrolleeProfile/GetEnrolleeBioDataByEnrolleeID?enrolleeid=${enrolleeData}`,
                {
                    method: "GET",
                },
            );

            const data = await response.json();

            console.log("biodata", data.result[0].Member_ParentMemberUniqueID);

            setBiodata(data.result[0].Member_ParentMemberUniqueID);
        } catch (error) {
            console.error("get title:", error);
        }
    }

    const handleAddDependant = () => {
        setDependants((prev) => [...prev, dependantData]); // dependantData is your form state
        setDependantData({}); // clear dependant form if needed
    };

    const submitDependantsSequentially = async (enrolleeData, bioData) => {
        const responses = [];

        for (const dependant of dependants) {
            const postData = {
                AddBeneficiary: [
                    {
                        groupid: formData.company,
                        MemberShipNo: enrolleeData,
                        Parent_Cif: bioData,
                        Cif_number: "",
                        OfflineID: formData.staffNo,
                        FirstName: dependant.firstName,
                        Surname: dependant.surname,
                        DateOfBirth: dependant.dob,
                        Sex_ID: dependant.gender,
                        MaritalStatus: "",
                        EmailAdress: formData.email,
                        Home_Phone: formData.phone,
                        Work_Phone: formData.phone,
                        Mobile: formData.phone,
                        Mobile2: formData.phone,
                        Hospital: "",
                        Scheme: formData.scheme,
                        Postal_Phone: formData.phone,
                        Physical_Add1: formData.address,
                        Postal_Town_ID: "",
                        Relationship_ID: dependant.relationship,
                        BloodGroup: "",
                        PreExistingCondition: "",
                        EnrolleePictureType:
                            dependant.passport?.type?.split("/")[1] || "jpeg",
                        EnrolleePicture: `data:${dependant.passport?.type};base64,${dependant.passport?.base64}`,

                        genotype: "",
                        othernames: "",
                        regionid: "",
                        schemeid: formData.schemeId,
                        startdate: formData.startdate,
                        registrationsource: "Web",
                        usercaptured: "firstbillspay@firstbankgroup.com",
                    },
                ],
            };

            console.log(
                " dependant API sent:",
                JSON.stringify(postData, null, 2),
            );
            try {
                const response = await fetch(
                    `${apiUrl}/api/EnrolleeProfile/AddBeneficiaryList`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(postData),
                    },
                );

                const data = await response.json();
                console.log(
                    " dependant API Response:",
                    JSON.stringify(data, null, 2),
                );

                const enrolleeInfo = {
                    UniqueMembershipNo:
                        data.Enrollee_Numbers?.[0]?.UniqueMembershipNo || "N/A",
                    EnrolleeName:
                        data.Enrollee_Numbers?.[0]?.EnrolleeName || "N/A",
                };

                responses.push(enrolleeInfo);
            } catch (error) {
                responses.push({
                    UniqueMembershipNo: "Error",
                    EnrolleeName: error.message,
                });
            }
        }

        return responses;
    };

    async function GetTitle() {
        try {
            const response = await fetch(`${apiUrl}api/ListValues/GetTitles`, {
                method: "GET",
            });

            const data = await response.json();

            console.log("data", data);

            setTitle(data.result);
        } catch (error) {
            console.error("get title:", error);
        }
    }
    async function GetRelationship() {
        try {
            const response = await fetch(
                `${apiUrl}api/ListValues/GetBeneficiaryRelationship`,
                {
                    method: "GET",
                },
            );

            const data = await response.json();

            console.log("relationship", data);

            setRelationship(data);
        } catch (error) {
            console.error("get title:", error);
        }
    }

    async function GetMaritalStatus() {
        try {
            const response = await fetch(
                `${apiUrl}api/ListValues/GetMaritalStatus`,
                {
                    method: "GET",
                },
            );

            const data = await response.json();

            setMarital(data.result);
        } catch (error) {
            console.error("get Marital:", error);
        }
    }

    async function Gender() {
        try {
            const response = await fetch(`${apiUrl}api/ListValues/GetGender`, {
                method: "GET",
            });

            const data = await response.json();
            console.log("gender", data.result);
            setGender(data.result);
        } catch (error) {
            console.error("get Gender:", error);
        }
    }

    async function GetCompany() {
        try {
            const response = await fetch(`${apiUrl}api/ListValues/GetGroups`, {
                method: "GET",
            });

            const data = await response.json();
            console.log("data", data);

            setCompany(data.result);
        } catch (error) {
            console.error("get Marital:", error);
        }
    }

    useEffect(() => {
        if (selectedGroupId) {
            GetCompanyScheme(selectedGroupId); // only called when selectedGroupId is set
        }
    }, [selectedGroupId]);

    async function GetCompanyScheme(groupId) {
        try {
            const response = await fetch(
                `${apiUrl}api/CorporateProfile/GetClientProfiledPlans?group_id=${groupId}`,
                {
                    method: "GET",
                },
            );

            const data = await response.json();
            console.log("scheme", data);
            setScheme(data.result);
        } catch (error) {
            console.error("get Marital:", error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];

                setFormData((prev) => ({
                    ...prev,
                    passport: {
                        name: file.name,
                        base64: base64String,
                        type: file.type,
                    },
                }));
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDependantFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1];
            setDependantData((prev) => ({
                ...prev,
                passport: {
                    name: file.name,
                    type: file.type,
                    base64: base64String,
                },
            }));
        };
        reader.readAsDataURL(file);
    };

    function logout() {
        navigate("/");
        localStorage.clear();
    }

    const handleDependantChange = (e) => {
        const { name, value } = e.target;
        setDependantData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDependantImage = (e) => {
        setDependantData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", { ...formData, dependants });
        // Add your form submission logic here
    };

    const handleFullSubmission = async () => {
        await Submit(); // first submit enrollee
        // The enrolleeData and bioData updates will trigger the useEffect to handle dependants
    };

    return (
        <div className="w-full p-7  bg-gray-200 rounded-lg shadow-md">
            <div className=" flex justify-between">
                <img
                    src="./leadway_health_logo-dashboard.png"
                    alt=""
                    className="  sm:w-[5rem] md:w-[7rem] lg:w-[10rem] w-[7rem]"
                />
                <div className=" flex  cursor-pointer" onClick={logout}>
                    <CgLogOut className=" text-red-700 mt-1.5" />
                    <h3 className="text-red-700">Logout</h3>
                </div>
            </div>

            <h1 className="font-bold text-center mb-6 text-red-700 sm:text-[10px] md:text-[15px] lg:text-[30px] text-[16px]">
                Please fill the form below. All fields are mandatory
            </h1>

            <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4  sm:mx-[8rem] md:mx-[0.1rem] lg:mx-[0.1rem]">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Company
                    </label>
                    <select
                        name="company"
                        className="w-full border rounded p-2"
                        value={formData.company}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value); // Convert string to number
                            const selectedItem = company.find(
                                (c) => c.GROUP_ID === selectedId,
                            );

                            setFormData({ ...formData, company: selectedId });

                            if (selectedItem) {
                                setSelectedGroupId(selectedId);
                            }
                        }}
                        required
                    >
                        <option value="">Select</option>
                        {company.length === 0 ? (
                            <option value="">Loading companies...</option>
                        ) : (
                            company.map((items) => (
                                <option
                                    key={items.GROUP_ID}
                                    value={items.GROUP_ID}
                                >
                                    {items.GROUP_NAME}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Scheme
                    </label>
                    <select
                        name="scheme"
                        className="w-full border rounded p-2"
                        value={JSON.stringify({
                            name: formData.scheme,
                            id: formData.schemeId,
                        })}
                        onChange={(e) => {
                            const selected = JSON.parse(e.target.value);
                            setFormData({
                                ...formData,
                                scheme: selected.name,
                                schemeId: selected.id,
                            });
                        }}
                    >
                        <option value="">Select</option>
                        {scheme.length === 0 ? (
                            <option value="" disabled>
                                No scheme available
                            </option>
                        ) : (
                            scheme.map((item) => (
                                <option
                                    key={item.PlanID}
                                    value={JSON.stringify({
                                        name: item.PlanName,
                                        id: item.PlanID,
                                    })}
                                >
                                    {item.PlanName}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>
            <p className=" pt-3 text-red-700 font-bold ml-1">
                Kindly Enter Your Personal Details Below
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    Submit();
                }}
            >
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
                            <option value="">Select</option>
                            {title.map((item) => (
                                <option
                                    key={item.title_id}
                                    value={item.title_id}
                                >
                                    {item.title || "No scheme availabe"}
                                </option>
                            ))}
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
                            <option value="">Select </option>
                            {marital.map((items) => (
                                <option
                                    key={items.Marital_statusid}
                                    value={items.Marital_statusid}
                                >
                                    {items.MaritalStatus}
                                </option>
                            ))}
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
                            <option value="">Select </option>
                            {gender.map((items) => (
                                <option key={items.Sex_id} value={items.Sex_id}>
                                    {items.Sex}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className>
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
                            Start Date
                        </label>
                        <input
                            type="date"
                            name="startdate"
                            className="w-full border rounded p-2"
                            value={formData.startdate}
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
                <div className="mb-3">
                    <h2 className="text-xl font-semibold mb-4">Dependants</h2>

                    {dependants.length > 0 && (
                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border">
                                <thead>
                                    <tr className="bg-gray-100 ">
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
                                    </tr>
                                </thead>
                                <tbody className=" border-b-black">
                                    {dependants.map((dependant, index) => (
                                        <tr
                                            key={index}
                                            className="border !border-b-black"
                                        >
                                            <td className="p-2">
                                                {dependant.image?.name ||
                                                    "No file chosen"}
                                            </td>
                                            <td className="p-2">
                                                {dependant.surname}
                                            </td>
                                            <td className="p-2">
                                                {dependant.firstName}{" "}
                                                {/* Changed from othername to firstName */}
                                            </td>
                                            <td className="p-2">
                                                {dependant.dob}
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
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex  sm:w-[14rem] md:w-[14rem]  "
                    >
                        <MdAdd className=" text-white w-7 h-7" />
                        Add New Dependant
                    </button>
                </div>
                {/* <div className=" flex justify-between">
                    <div></div>
                    <button
                        type="button"
                        className="bg-red-700 text-white px-3 py-2 justify-items-end rounded hover:bg-green-600 flex gap-2"
                        onClick={Submit}
                    >
                        <IoIosSend className=" text-white pt-1 h-6 w-6" />
                        Submit Records
                    </button>
                </div> */}
                <div className=" flex justify-items-end justify-end">
                    {isSubmitting ? (
                        <button
                            disabled
                            className="bg-red-700 text-white px-3 py-2 justify-items-end rounded hover:bg-green-600 flex gap-2"
                        >
                            <FaSpinner className="animate-spin text-xl" />
                            Submitting...
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="bg-red-700 text-white px-3 py-2 justify-items-end rounded hover:bg-green-600 flex gap-2"
                            onClick={Submit}
                        >
                            <IoIosSend className=" text-white pt-1 h-6 w-6" />
                            Submit Records
                        </button>
                    )}
                </div>
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50   px-2 ">
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
                                        onChange={handleDependantFileChange}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {dependantData.image?.name}
                                    </p>
                                </div>
                            </div>

                            <div className=" grid grid-cols-2 gap-2 ">
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
                                        name="firstName"
                                        className="w-full border rounded p-2"
                                        value={dependantData.firstName}
                                        onChange={handleDependantChange}
                                    />
                                </div>
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
                                        required
                                    >
                                        <option value="">Select </option>
                                        {gender.map((items) => (
                                            <option
                                                key={items.Sex_id}
                                                value={items.Sex_id}
                                            >
                                                {items.Sex}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Relationship
                                    </label>
                                    <select
                                        name="relationship"
                                        className="w-full border rounded p-2"
                                        value={dependantData.relationship}
                                        onChange={handleDependantChange}
                                        required
                                    >
                                        <option value="">Select </option>
                                        {relationship?.map((items) => (
                                            <option
                                                key={items.Value}
                                                value={items.Value}
                                            >
                                                {items.Text}
                                            </option>
                                        ))}
                                    </select>
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
                                onClick={handleAddDependant}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {apiSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Submitted Members
                        </h2>
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                            {allResponses.map((res, index) => (
                                <li
                                    key={index}
                                    className="border p-2 rounded text-sm"
                                >
                                    <strong>#{index + 1}</strong> <br />
                                    <span>
                                        <strong>EnrolleeName:</strong>{" "}
                                        {res.EnrolleeName}
                                    </span>
                                    <br />
                                    <span>
                                        <strong>Membership No:</strong>{" "}
                                        {res.UniqueMembershipNo}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setApiSuccessModal(false)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {errorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md border-l-4 border-red-500">
                        <div className="flex items-center mb-4">
                            <div className="bg-red-100 p-2 rounded-full mr-3">
                                <svg
                                    className="h-6 w-6 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-red-700">
                                Error
                            </h2>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">{errorMessage}</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setErrorModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={() => {
                                    setErrorModal(false);
                                    // You could add retry logic here if needed
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Homepage;
