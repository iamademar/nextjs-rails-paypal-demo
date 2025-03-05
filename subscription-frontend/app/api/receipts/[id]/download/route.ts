import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise to access the 'id' parameter
    const { id: receiptId } = await params;

    // Fetch the PDF from the backend API without authentication
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/receipts/${receiptId}/download`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY || "",
        },
      }
    );

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Failed to download receipt" },
        { status: response.status }
      );
    }

    // Get the PDF data and content disposition from the response
    const pdfBuffer = await response.arrayBuffer();
    const contentDisposition =
      response.headers.get("Content-Disposition") ||
      `attachment; filename="receipt-${receiptId}.pdf"`;

    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Error downloading receipt:", error);
    return NextResponse.json(
      { error: "Failed to download receipt" },
      { status: 500 }
    );
  }
}
