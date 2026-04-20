import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get("profileId");

    if (!profileId) {
      return Response.json({ error: "profileId is required" }, { status: 400 });
    }

    const mappings = await sql`
      SELECT * FROM gesture_mappings 
      WHERE profile_id = ${profileId}
    `;
    return Response.json(mappings);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch mappings" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { profile_id, gesture_name, action_name } = await request.json();

    const [mapping] = await sql`
      INSERT INTO gesture_mappings (profile_id, gesture_name, action_name)
      VALUES (${profile_id}, ${gesture_name}, ${action_name})
      ON CONFLICT (profile_id, gesture_name) 
      DO UPDATE SET action_name = EXCLUDED.action_name
      RETURNING *
    `;

    return Response.json(mapping);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update mapping" },
      { status: 500 },
    );
  }
}
