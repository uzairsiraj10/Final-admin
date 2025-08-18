import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// GET: Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const users = await query(
      "SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT: Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, email, password, role, status } = await request.json();

    // Check if user exists
    const existingUser = await query("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email, id]
      );
      if (emailCheck.length > 0) {
        return NextResponse.json(
          { error: "Email already taken by another user" },
          { status: 400 }
        );
      }
    }

    // Build update query
    let updateQuery = "UPDATE users SET ";
    const updateValues = [];
    const updateFields = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (password) {
      updateFields.push("password_hash = ?");
      updateValues.push(await hashPassword(password));
    }
    if (role) {
      updateFields.push("role = ?");
      updateValues.push(role);
    }
    if (status) {
      updateFields.push("status = ?");
      updateValues.push(status);
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP");
    updateQuery += updateFields.join(", ") + " WHERE id = ?";
    updateValues.push(id);

    await query(updateQuery, updateValues);

    const updatedUser = await query(
      "SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?",
      [id]
    );

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const existingUser = await query("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Delete user
    await query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
} 