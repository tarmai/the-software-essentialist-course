
import { createAPIClient } from "@dddforum/shared/src/api";
import { UserResponseStub } from "@dddforum/shared/tests/support/stubs/userResponseStub";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { Config } from "../../src/shared/config";

describe("users http API", () => {
  const client = createAPIClient("http://localhost:3000");
  const config = new Config("test:e2e");

  const composition = CompositionRoot.createCompositionRoot(config);
  const server = composition.getWebServer();

  const application = composition.getApplication();

  let createUserSpy: jest.SpyInstance;

  beforeAll(async () => {
    await server.start();
    createUserSpy = jest.spyOn(application.users, 'createUser');
  });

  afterEach(() => {
    createUserSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("can create users", async () => {
    const createUserParams = new CreateUserBuilder()
      .withAllRandomDetails()
      .withFirstName("Khalil")
      .withLastName("Stemmler")
      .build();

    const createUserResponseStub = new UserResponseStub()
      .fromParams(createUserParams)
      .build();

      createUserSpy.mockResolvedValue(createUserResponseStub);

    // Act
    // Use the client library to make the api call (pass through as much
    // uncertainty as possible)
    await client.users.register(createUserParams);

    // Communication: Expect it to have called the correct use case
    expect(application.users.createUser).toHaveBeenCalledTimes(1);
  });
});
