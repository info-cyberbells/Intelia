import User from "../models/user.model.js";
import fs from "fs";
import crypto from "crypto";

// Generate temporary password
const generateTempPassword = () => {
  return crypto.randomBytes(8).toString("hex");
};

// @desc    Get all clients (owners)
// @route   GET /api/superAdmin/clients
// @access  Super Admin
export const getAllClients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { role: "owner" };

    // Search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status !== undefined) {
      query.isActive = status === "active" ? true : false;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const clients = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: clients,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get single client by ID
// @route   GET /api/superAdmin/clients/:id
// @access  Super Admin
export const getClientById = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "owner",
    }).select("-password");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.json({ success: true, data: client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Create new client (owner)
// @route   POST
// @access  Super Admin
export const createClient = async (req, res) => {
  try {
    const { firstName, surname, companyName, correspondedMe, email, phoneNumber } = req.body;

    // Validate required fields
    if (!firstName || !surname || !companyName || !correspondedMe || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Generate temporary password
    // const tempPassword = generateTempPassword();
    const tempPassword = 'Test@123';

    // Find this line in createClient:
    const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    // Find this line in updateClient:
    if (req.file) {
      if (client.profileImage) {
        const oldImagePath = `.${client.profileImage}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      client.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    // Create client
    const client = await User.create({
      firstName,
      surname,
      companyName,
      correspondedMe,
      email,
      phoneNumber,
      password: tempPassword,
      role: "owner",
      profileImage,
      isActive: true,
    });

    const clientResponse = client.toObject();
    // delete clientResponse.password;

    res.status(201).json({
      success: true,
      message: "Client created successfully.",
      data: clientResponse,
    //   tempPassword: tempPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update client
// @route   PUT
// @access  Super Admin
export const updateClient = async (req, res) => {
  try {
    const { firstName, surname, companyName, correspondedMe, email, phoneNumber } = req.body;

    const client = await User.findOne({
      _id: req.params.id,
      role: "owner",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if email is being changed and already exists
    if (email && email !== client.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    // Update fields
    if (firstName) client.firstName = firstName;
    if (surname) client.surname = surname;
    if (companyName) client.companyName = companyName;
    if (correspondedMe) client.correspondedMe = correspondedMe;
    if (email) client.email = email;
    if (phoneNumber) client.phoneNumber = phoneNumber;

    // Update profile image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (client.profileImage) {
        const oldImagePath = `.${client.profileImage}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      client.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await client.save();

    // Remove password from response
    const clientResponse = client.toObject();
    delete clientResponse.password;

    res.json({
      success: true,
      message: "Client updated successfully",
      data: clientResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete client
// @route   DELETE /api/superAdmin/clients/:id
// @access  Super Admin
export const deleteClient = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "owner",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Delete profile image if exists
    if (client.profileImage) {
      const imagePath = `.${client.profileImage}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Toggle client status (Active/Inactive)
// @route   PATCH /api/superAdmin/clients/:id/toggle-status
// @access  Super Admin
export const toggleClientStatus = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "owner",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    client.isActive = !client.isActive;
    await client.save();

    res.json({
      success: true,
      message: `Client ${client.isActive ? "activated" : "deactivated"} successfully`,
      data: {
        _id: client._id,
        isActive: client.isActive,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get client statistics
// @route   GET /api/superAdmin/clients/stats
// @access  Super Admin
export const getClientStats = async (req, res) => {
  try {
    const totalClients = await User.countDocuments({ role: "owner" });
    const activeClients = await User.countDocuments({ role: "owner", isActive: true });
    const inactiveClients = await User.countDocuments({ role: "owner", isActive: false });

    res.json({
      success: true,
      data: {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};