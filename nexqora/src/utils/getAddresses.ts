import { TokenOption } from "./constants";

export default function getAddresses(tokens: TokenOption[]) {

    const addresses = tokens.map((token) => {
        return token.contractAddress;
    })

    return addresses ?? [];
}