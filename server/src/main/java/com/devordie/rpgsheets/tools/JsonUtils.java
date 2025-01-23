package com.devordie.rpgsheets.tools;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Stream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

public class JsonUtils {

  private static final ObjectMapper MAPPER = new ObjectMapper(new YAMLFactory())
      .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  private static final Log LOGGER = LogFactory.getLog(JsonUtils.class);

  public JsonNode loadFile(Path path) {
    try {
      return MAPPER.readTree(Files.readAllBytes(path));
    } catch (IOException ex) {
      LOGGER.warn("Error loading file " + path.toAbsolutePath().toString());
      return null;
    }
  }

  public Map<String, JsonNode> loadDirectory(Path path) {
    final Map<String, JsonNode> res = new HashMap<>();
    try (final Stream<Path> files = Files.list(path)) {
      for (final Path file : files
          .filter(file -> file.toString().endsWith(".json") || file.toString().endsWith(".yaml")).toList()) {
        final JsonNode node = loadFile(file);
        if (node != null) {
          final String filename = file.getFileName().toString();
          res.put(filename.substring(0, filename.lastIndexOf('.')), node);
        }
      }
      return res;
    } catch (IOException ex) {
      throw new IllegalStateException("Error listing directory " + path.toAbsolutePath().toString(), ex);
    }
  }

  public ObjectNode inherit(JsonNode child, JsonNode parent) {
    final ObjectNode node = new ObjectNode(null);
    for (final Entry<String, JsonNode> jsonNode : parent.properties()) {
      node.set(jsonNode.getKey(), jsonNode.getValue().deepCopy());
    }
    for (final Entry<String, JsonNode> jsonNode : child.properties()) {
      if (node.has(jsonNode.getKey()) && jsonNode.getValue().isObject()) {
        node.set(jsonNode.getKey(), inherit(jsonNode.getValue(), parent.get(jsonNode.getKey())));
      } else {
        node.set(jsonNode.getKey(), jsonNode.getValue());
      }
    }
    return node;
  }
}
