package helloSnap;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import org.crac.Core;
import org.crac.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handler for requests to Lambda function.
 */
public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent>, Resource {

    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent().withHeaders(headers);
        try {
            final String pageContents = this.getPageContents("https://checkip.amazonaws.com");
            String output = String.format("{ \"message\": \"hello java\", \"location\": \"%s\" }", pageContents);

            return response.withStatusCode(200).withBody(output);
        } catch (IOException e) {
            return response.withBody("{}").withStatusCode(500);
        }
    }

    private String getPageContents(String address) throws IOException {
        URL url = new URL(address);
        try (BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()))) {
            return br.lines().collect(Collectors.joining(System.lineSeparator()));
        }
    }

    public App() {
        Core.getGlobalContext().register(this);
    }

    /**
     * Runtime hooks for Lambda SnapStart：https://docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks.html
     *
     * @param context
     * @throws Exception
     */
    @Override
    public void beforeCheckpoint(org.crac.Context<? extends Resource> context) throws Exception {
        System.out.println("Before checkpoint A");

    }

    /**
     * Runtime hooks for Lambda SnapStart：https://docs.aws.amazon.com/lambda/latest/dg/snapstart-runtime-hooks.html
     *
     * @param context
     * @throws Exception
     */
    @Override
    public void afterRestore(org.crac.Context<? extends Resource> context) throws Exception {
        System.out.println("After restore");
    }
}
