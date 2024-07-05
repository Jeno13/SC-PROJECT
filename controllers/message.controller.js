const Request = require("../models/Request");
const mongoose = require("mongoose");
const Message = require("../models/Message");

const GET_PROJECT_MESSAGES = async (req, res) => {
  const { id, request } = req.params;
  const data = {
    layout: "./layouts/dashboard-layout",
  };

  try {
    const requestDocument = await Request.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(request),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sponsor",
          foreignField: "_id",
          as: "sponsor",
        },
      },
      {
        $unwind: "$sponsor",
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDocument",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "student",
              },
            },
            {
              $unwind: "$student",
            },
          ],
        },
      },
      {
        $unwind: "$projectDocument",
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "request",
          as: "messages",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $unwind: "$user",
            },
          ],
        },
      },
      {
        $project: {
          project: {
            id: "$projectDocument._id",
            title: "$projectDocument.title",
          },
          student: {
            id: "$projectDocument.student._id",
            name: "$projectDocument.student.name",
            profilePicture: "$projectDocument.student.profilePicture",
          },
          sponsor: {
            id: "$sponsor._id",
            name: "$sponsor.name",
            profilePicture: "$sponsor.student.profilePicture",
          },
          messages: "$messages",
        },
      },
    ]);

    if (!requestDocument.length) {
      return res.redirect("back");
    }

    // If user is student check if this belongs to current student
    if (
      req.session.user.type === "student" &&
      !requestDocument[0].student.id.equals(req.session.user.id)
    ) {
      return res.redirect("back");
    }

    // If user is sponsor check if this belongs to current sponsor
    if (
      req.session.user.type === "sponsor" &&
      !requestDocument[0].sponsor.id.equals(req.session.user.id)
    ) {
      return res.redirect("back");
    }

    data.title = `${requestDocument[0].project.title} messages`;
    data.project = requestDocument[0].project;
    data.sponsor = requestDocument[0].sponsor;
    data.student = requestDocument[0].student;
    data.messages = requestDocument[0].messages;

    return res.render("dashboard/projects/message", data);
  } catch (error) {
    return res.redirect("back");
  }
};

const POST_PROJECT_REQUEST_MESSAGE = async (req, res) => {
  const { id, request } = req.params;
  const {message} = req.body;

  try {
    const requestDocument = await Request.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(request),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sponsor",
          foreignField: "_id",
          as: "sponsor",
        },
      },
      {
        $unwind: "$sponsor",
      },
      {
        $lookup: {
          from: "projects",
          localField: "project",
          foreignField: "_id",
          as: "projectDocument",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "student",
              },
            },
            {
              $unwind: "$student",
            },
          ],
        },
      },
      {
        $unwind: "$projectDocument",
      },
      {
        $project: {
          project: {
            id: "$projectDocument._id",
            title: "$projectDocument.title",
          },
          student: {
            id: "$projectDocument.student._id",
            name: "$projectDocument.student.name",
          },
          sponsor: {
            id: "$sponsor._id",
            name: "$sponsor.name",
          },
        },
      },
    ]);

    if (!requestDocument.length) {
      return res.redirect("back");
    }

    // If user is student check if this belongs to current student
    if (
      req.session.user.type === "student" &&
      !requestDocument[0].student.id.equals(req.session.user.id)
    ) {
      return res.redirect("back");
    }

    // If user is sponsor check if this belongs to current sponsor
    if (
      req.session.user.type === "sponsor" &&
      !requestDocument[0].sponsor.id.equals(req.session.user.id)
    ) {
      return res.redirect("back");
    }

    await Message.create({
      request: request,
      user: req.session.user.id,
      message
    });
    return res.redirect("back");
  } catch (error) {
    return res.redirect("back");
  }
};

module.exports = {
  GET_PROJECT_MESSAGES,
  POST_PROJECT_REQUEST_MESSAGE,
};
