import { NextResponse } from "next/server";

interface Address {
  recipientName: string;
  streetType: string;
  streetName: string;
  streetNumber: string;
  complement: string;
  neighborhood: string;
  zipCode: string;
  city: string;
  state: string;
}

export async function POST(request: Request) {
  try {
    const address: Address = await request.json();
    console.log("Received address:", address);
    // In a real application, save the address to a database or associate it with the order
    return NextResponse.json({ message: "Endereço salvo com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving address:", error);
    return NextResponse.json(
      { error: "Erro ao salvar o endereço." },
      { status: 500 }
    );
  }
}