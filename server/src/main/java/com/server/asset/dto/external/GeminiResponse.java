package com.server.asset.dto.external;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiResponse {
    private List<Candidate> candidates;

    @Getter @NoArgsConstructor @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Candidate {
        private Content content;
    }
    @Getter @NoArgsConstructor @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content {
        private List<Part> parts;
    }
    @Getter @NoArgsConstructor @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Part {
        private String text;
    }

    public String getText() {
        if (candidates == null || candidates.isEmpty()) {
            return "";
        }

        Candidate firstCandidate = candidates.getFirst();
        if (firstCandidate.getContent() == null || firstCandidate.getContent().getParts() == null) {
            return "";
        }

        // 모든 Part의 text를 순회하며 null이 아닌 것들을 하나로 합침
        return firstCandidate.getContent().getParts().stream()
            .map(Part::getText)
            .filter(Objects::nonNull)
            .collect(Collectors.joining(""));
    }
}
