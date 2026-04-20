import sql from "@/app/api/utils/sql";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, sensitivity, mode, is_active } = body;

    // If setting active, deactivate others
    if (is_active) {
      await sql`UPDATE profiles SET is_active = false`;
    }

    const updates = [];
    const values = [];
    let i = 1;

    if (name !== undefined) {
      updates.push(`name = $${i++}`);
      values.push(name);
    }
    if (sensitivity !== undefined) {
      updates.push(`sensitivity = $${i++}`);
      values.push(sensitivity);
    }
    if (mode !== undefined) {
      updates.push(`mode = $${i++}`);
      values.push(mode);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${i++}`);
      values.push(is_active);
    }

    if (updates.length === 0)
      return Response.json({ error: "No updates provided" }, { status: 400 });

    values.push(id);
    const [profile] = await sql(
      `UPDATE profiles SET ${updates.join(", ")} WHERE id = $${i} RETURNING *`,
      values,
    );

    return Response.json(profile);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await sql`DELETE FROM profiles WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete profile" },
      { status: 500 },
    );
  }
}
