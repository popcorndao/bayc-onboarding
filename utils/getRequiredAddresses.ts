export interface RequiredAddresses {
  pop: string;
  distributor: string;
  merkleOrchard: string;
}

export default function getRequiredAddresses(
  network: string
): RequiredAddresses {
  const addresses = {
    mainnet: {
      pop: "",
      distributor: "",
      merkleOrchard: "0xdAE7e32ADc5d490a43cCba1f0c736033F2b4eFca",
    },
    rinkeby: {
      pop: "0x2189d3c2F29D3A7bc207AD5EFA3D9847035e4469",
      distributor: "0x8830Ac7aF80Bbd1F2c040a5b135Ff0d8e080224d",
      merkleOrchard: "0x0F3e0c4218b7b0108a3643cFe9D3ec0d4F57c54e",
    },
  };
  return addresses[network]
}
