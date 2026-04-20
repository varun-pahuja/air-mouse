import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const profiles = await sql`SELECT * FROM profiles ORDER BY created_at DESC`;
    return Response.json(profiles);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch profiles" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const [profile] = await sql`
      INSERT INTO profiles (name) 
      VALUES (${name}) 
      RETURNING *
    `;

    // Seed default mappings for new profile
    const defaultMappings = [
      { gesture: "V", action: "Next Slide" },
      { gesture: "O", action: "Previous Slide" },
      { gesture: "Swipe", action: "Scroll" },
      { gesture: "Circle", action: "Left Click" },
    ];

    for (const m of defaultMappings) {
      await sql`
        INSERT INTO gesture_mappings (profile_id, gesture_name, action_name)
        VALUES (${profile.id}, ${m.gesture}, ${m.action})
      `;
    }

    return Response.json(profile);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create profile" },
      { status: 500 },
    );
  }
}
